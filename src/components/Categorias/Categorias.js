import React, { useState, useEffect, useContext } from 'react';
import {  Button, Divider, Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import './categorias.scss';
import './preloading.scss';
import clienteAxios from '../../config/axios';
import { MenuContext } from '../../context/carritoContext';
import { MenuItem } from 'react-bootstrap';

const { SubMenu } = Menu;

const Categorias = (props) => {
	const token = localStorage.getItem('token');
	const [ categorias, setCategorias ] = useState([]);
	const [ generos, setGeneros ] = useState([{_id: 'Todos'}]);
	const [ temporadas, setTemporadas ] = useState([]);
/* 	const [ loading, setLoading ] = useState(false); */
	const { reloadFilter } = useContext(MenuContext);

	const [ categoriaSeleccionada, setCategoriaSeleccionada, ] = useState(null);
	const [ subcategoriaSeleccionada, setSubcategoriaSeleccionada, ] = useState(null);
	const [ temporadaSeleccionada, setTemporadaSeleccionada, ] = useState(null);
	const [ generoSeleccionado, setGeneroSeleccionado ] = useState(null);

	useEffect(() => {
		obtenerCategorias();
		obtenerGeneros();
		obtenerTemporadas();
	}, []);

	useEffect(() => {
		limpiarFiltros();
	}, [ reloadFilter ])

	const limpiarFiltros = () => {
		setCategoriaSeleccionada(null)
		setSubcategoriaSeleccionada(null)
		setTemporadaSeleccionada(null)
		setGeneroSeleccionado(null)
	}

	async function obtenerCategorias() {
		// setLoading(true);
		await clienteAxios
			.get('/productos/filtrosNavbar', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				// setLoading(false);
				setCategorias(res.data);
				window.scrollTo(0, 0);
			})
			.catch((res) => {
				// setLoading(false);
			});
	}

	async function obtenerGeneros() {
		await clienteAxios
			.get('/productos/agrupar/generos')
			.then((res) => {
				setGeneros([...generos, ...res.data]);
			})
			.catch((res) => {
			});
	}

	async function obtenerTemporadas() {
		await clienteAxios
			.get(`/productos/agrupar/temporadas`)
			.then((res) => {
				setTemporadas(res.data);
			})
			.catch((err) => {
			});
	}
	
	if(!generos || !categorias){
		return null;
	}

	const categorias_nav = categorias.map((categoria, index) => {
		return (
			<SubMenu
				key={categoria.categoria}
				title={categoria.categoria}
				className="submenu-categoria nav-font-color-categorias container-subcategorias-nav size-submenu-cat font-cates"
				onTitleClick={(e) => {
					if(e.key === categoria.categoria){
						props.history.push(`/filtros/${temporadaSeleccionada}/${categoria.categoria}/${subcategoriaSeleccionada}/${generoSeleccionado}`);
						setCategoriaSeleccionada(categoria.categoria);
					}
					
				}}

			>
				{categoria.subcCategoria.map((sub) => {
					return (
						<Menu.Item
							className="font-subCate"
							key={sub._id}
							onClick={() => {
								props.history.push(`/filtros/${temporadaSeleccionada}/${categoriaSeleccionada}/${sub._id}/${generoSeleccionado}`);
								setSubcategoriaSeleccionada(sub._id);
							}}
						>
							{sub._id}
						</Menu.Item>
					);
				})}
			</SubMenu>
			// 
		);
	});

	const temporadas_nav = temporadas.map((temporada, index) => {
		if(temporada._id){
			return (
				<Menu.Item
					className="nav-font-color-categorias font-genero"
					key={index}
					onClick={() => {
						props.history.push(`/filtros/${temporada._id}/${categoriaSeleccionada}/${subcategoriaSeleccionada}/${generoSeleccionado}`);
						setTemporadaSeleccionada(temporada._id);
					}}
				>
					{temporada._id}
				</Menu.Item>
			);
		}
		return
	});

	const categorias_generos = generos.map((generos) => {
		return (
			<Menu.Item
				className="submenu-categoria nav-font-color-categorias container-subcategorias-nav size-submenu-cat font-genero"
				key={generos._id}
				onClick={() => {
					props.history.push(`/filtros/${temporadaSeleccionada}/${categoriaSeleccionada}/${subcategoriaSeleccionada}/${generos._id}`);
					setGeneroSeleccionado(generos._id)
				}}
				
			>
				{generos._id}
			</Menu.Item>
		);
	});

	return (
		<div>
		<Layout className="container-subcategorias-nav d-lg-inline size-layout-cat">
			{/* <Spin className="ml-5 d-inline spin-nav-categorias" spinning={loading} /> */}
			<Menu
				className="categorias-navbar d-inline size-menu-cat font-genero"
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[ window.location.pathname ]}
				triggerSubMenuAction="click"
			>
				{generos.length !== 0 ? (
					categorias_generos
				) : (
					<Menu.Item className="d-none" />
				)}
				<SubMenu
					title="Temporadas"
					className="submenu-categoria nav-font-color-categorias container-subcategorias-nav size-submenu-cat font-genero"

				>
				{temporadas_nav}
				</SubMenu>
			</Menu>
		</Layout>
		<Layout className="container-subcategorias-nav size-layout-cat">
			<Menu
				className="categorias-navbar d-inline size-menu-cat"
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[ window.location.pathname ]}
				triggerSubMenuAction="click"
			>
				{categorias_nav}
			</Menu>
		</Layout>
		</div>
	);
};

export default withRouter(Categorias);
